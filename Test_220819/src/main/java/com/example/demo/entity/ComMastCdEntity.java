package com.example.demo.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="com_mast_cd")
public class ComMastCdEntity {

@Id @Column(name="mast_cd")			private String 					mastCd;
	@Column(name="mast_cd_nm")		private String 					mastCdNm;
	@Column(name="use_yn")			private Character 				useYn;
	@Column(name="create_user_id")	private String 					createUserId;
	@Column(name="create_date")		private LocalDateTime 			createDate;
	@Column(name="modify_user_id")	private String					modifyUserId;
	@Column(name="modify_date")		private LocalDateTime 			modifiyDate;

}
